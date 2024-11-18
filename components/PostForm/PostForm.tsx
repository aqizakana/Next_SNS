import axios from "axios";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { ResultCardList } from "../resultCard/resultCardList";
import styles from "./PostForm.module.css";

type PostFormProps = {
	onPostCreated: (newPost: AnalysisResult) => void;
	SetActive: (active: boolean) => void;
};

type AnalysisResult = {
	id: number;
	username: string;
	status: number;
	content: string;
	charCount: number;
	koh_sentiment: Array<{
		label: string;
		score: number;
	}>;
	bert: {
		result: {
			sentiment: string;
		};
	};
	date: Date;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const PostForm: React.FC<PostFormProps> = ({ onPostCreated, SetActive }) => {
	const [content, setContent] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const fetchUserInfo = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("認証エラー：ログインしてください。");
				return;
			}

			try {
				const response = await axios.get(
					`${apiBaseUrl}/api/v1/accounts/userinfo/`,
					{
						headers: {
							Authorization: `Token ${token}`,
							"Content-Type": "application/json",
						},
					},
				);
				setUsername(response.data.username);
			} catch (error) {
				console.error("ユーザー情報の取得エラー:", error);
				setError("ユーザー情報の取得に失敗しました。");
			}
		};

		fetchUserInfo();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		SetActive(true);
		e.preventDefault();
		setError(null);

		const token = localStorage.getItem("token");
		if (!token) {
			setError("認証エラー：ログインしてください。");
			return;
		}

		try {
			const countResponse = await axios.post(
				`${apiBaseUrl}/api/v1/analyze/charCount/`,
				{ content: content },
			);
			const sentimentResponse = await axios.post(
				`${apiBaseUrl}/api/v1/analyze/analyze_sentiment/`,
				{ content: content },
			);
			const bertResponse = await axios.post(
				`${apiBaseUrl}/api/v1/analyze/analyze_8labels/`,
				{ content: content },
			);
			if (
				countResponse.status !== 200 ||
				sentimentResponse.status !== 200 ||
				bertResponse.status !== 200
			) {
				throw new Error("分析中にエラーが発生しました。");
			}

			const date = new Date();

			const newResult: AnalysisResult = {
				id: analysisResults.length + 1,
				username: username || "unknown",
				status:
					countResponse.status + sentimentResponse.status + bertResponse.status,
				content: content,
				charCount: countResponse.data,
				koh_sentiment: sentimentResponse.data,
				bert: bertResponse.data,
				date: date,
			};

			setAnalysisResults((prevResults) => [...prevResults, newResult]);

			const response = await axios.post(
				`${apiBaseUrl}/api/v1/posts/create/`,
				{ content },
				{
					headers: {
						Authorization: `Token ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			setContent("");
			const newPost = {
				...response.data,
				newResult,
			};

			onPostCreated(newPost.newResult);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response) {
					setError(
						`エラー: ${error.response.status} - ${error.response.data.detail || "不明なエラー"}`,
					);
				} else if (error.request) {
					setError("サーバーからの応答がありません。");
				} else {
					setError(`リクエストエラー: ${error.message}`);
				}
			} else {
				setError("不明なエラーが発生しました。");
			}
			console.error("投稿作成エラー:", error);
		}
	};

	return (
		<div>
			<nav class={styles.navbar}>
				<Link href="/" class={styles.navbar__links}>
					Home
				</Link>
				<Link href="/about" class={styles.navbar__links}>
					About
				</Link>
				<Link href="/accounts" class={styles.navbar__links}>
					Login
				</Link>
			</nav>
			<div class={`${styles.flex}`}>
				<form onSubmit={handleSubmit} class={styles.form}>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="200文字で何か書いてみてください。"
						rows={4}
						class={styles.textarea}
						maxLength={200}
						required={true}
					/>
					<button class={styles.button} type="submit">
						投稿
					</button>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</form>

				<ResultCardList analysisResults={analysisResults} />
			</div>
		</div>
	);
};

export default PostForm;
