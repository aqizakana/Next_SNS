"use client";

import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Loading } from "../../../components/Loading";
import { MessagePlate } from "../../../components/MessagePlate/MessagePlate";
import Links from "../../../components/PostForm/Links";
import PostForm from "../../../components/PostForm/PostForm";

import Image from "next/image";
import Layout from "../layout";
import styles from "./Home.module.css";
import { AddObject } from "./objects/AddObject";
import type { Prototypes } from "./objects/Shape/Prototype";
//型
import {
	type backgroundProps,
	initializeScene,
} from "./objects/initializeScene";
import type { AnalysisResult, MessageRecordItem, PsqlProps } from "./type";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
import { ResultCardList } from "../../../components/resultCard/resultCardList";

const Home: NextPage = () => {
	const [username, setUsername] = useState<string | null>(null);
	const [userID, setUserID] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
	const backgroundRef = useRef<backgroundProps | null>(null);
	const [loadedPosts, setLoadedPosts] = useState<PsqlProps[]>([]);
	const objectsToUpdate = useRef<Prototypes[]>([]);
	const objectsToAnimate = useRef<Prototypes[]>([]);
	const [clickedObjectInfo, setClickedObjectInfo] =
		useState<MessageRecordItem | null>(null);
	const [isActive, setIsActive] = useState<boolean>(false); // New state for tracking inactivity
	const [isFlexVisible, setIsFlexVisible] = useState(true); // State to control flex div visibility

	useEffect(() => {
		const fetchPosts = async () => {
			axios
				.get(`${apiBaseUrl}/api/v1/posts/SetGet/`)
				.then((response) => {
					setLoadedPosts(response.data);
					console.log("Posts fetched successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error fetching posts:", error);
				});
		};

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
				setUserID(response.data.id);
				console.log("ユーザー情報の取得に成功しました。",response.data);
			} catch (error) {
				console.error("ユーザー情報の取得エラー:", error);
				setError("ユーザー情報の取得に失敗しました。");
			}
		};

		fetchUserInfo();
		fetchPosts();
		const intervalId = setInterval(fetchPosts, 1000000); // 300000 ms = 5 minutes

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	useEffect(() => {
		if (canvasRef.current) {
			const background = initializeScene(canvasRef.current);
			backgroundRef.current = background;
			background.animate(objectsToUpdate.current);
			background.animate(objectsToAnimate.current);

			const threeCanvas: HTMLElement | null = document.getElementById("canvas");

			let handleClick: () => void;
			for (const object of loadedPosts) {
				loadPreviousObject(object);
				handleClick = () => logClickedObject();
				threeCanvas?.addEventListener("click", handleClick);
			}
			return () => {
				background.dispose();
				//threeCanvas?.removeEventListener('click', handleClick);
			};
		}
	}, [loadedPosts]);

	const loadPreviousObject = (object: PsqlProps) => {
		if (!backgroundRef.current) return;

		const analysisResult: AnalysisResult = {
			id: object.id,
			status: 200,
			userID: object.user_id,
			username: object.username,
			content: object.content,
			charCountResult: object.charCountResult,
			bert: {
				result: {
					sentiment: object.analyze8labelsResult.sentiment,
				},
			},
			date: new Date(object.createdAt),
			koh_sentiment: [
				{
					label: object.koheiduckSentimentLabel,
					score: object.koheiduckSentimentScore,
				},
			],
		};

		const addObjectInstance = new AddObject(analysisResult);
		const newObject = addObjectInstance.determineObjectAndMaterial();

		if (newObject) {
			objectsToUpdate.current.push(newObject);
			objectsToAnimate.current.push(newObject);
			backgroundRef.current.scene.add(newObject.getMesh());

			if (username === object.username) {
				const Sphere = addObjectInstance.OwnObject();
				Sphere.getMesh().position.set(
					-addObjectInstance.PosX,
					addObjectInstance.PosY,
					-addObjectInstance.PosZ,
				);

				backgroundRef.current.scene.add(Sphere.getMesh());
			}
		}
	};

	const addObjectToScene = (analysisResult: AnalysisResult) => {
		if (!backgroundRef.current) return;

		const addObjectInstance = new AddObject({
			...analysisResult,
		});
		const newObject = addObjectInstance.determineObjectAndMaterial();
		if (newObject) {
			objectsToUpdate.current.push(newObject);
			objectsToAnimate.current.push(newObject);
			backgroundRef.current.scene.add(newObject.getMesh());
			backgroundRef.current.cameraZoom(newObject.getMesh().position);
			console.log("newObject", newObject.getMesh().position);
			if (username === analysisResult.username) {
				const Sphere = addObjectInstance.OwnObject();
				Sphere.getMesh().position.set(
					-addObjectInstance.PosX,
					addObjectInstance.PosY,
					-addObjectInstance.PosZ,
				);
				backgroundRef.current.scene.add(Sphere.getMesh());
			}
			if (newObject.getMesh().position.y > 0) {
				backgroundRef.current.scene.remove(newObject.getMesh());
			}
		}
	};

	//THREEのオブジェクトの情報と、psqlの情報を比較して、同じものを探す。
	// ...

	const logClickedObject = () => {
		if (!backgroundRef.current) return;
		const clickedObject = backgroundRef.current.clickObject();
		const addObjectInstance = objectsToUpdate.current.find(
			(obj) => obj.getMesh() === clickedObject,
		);
		if (addObjectInstance) {
			setClickedObjectInfo(addObjectInstance);
		}

		return clickedObject;
	};

	const SetActivate = (isActive: boolean) => {
		setIsActive(isActive);
	};

	const handlePostCreated = (newPost: AnalysisResult) => {
		setAnalysisResults((prevResults) => [...prevResults, newPost]);
		addObjectToScene(newPost);
		setIsActive(isActive);
	};

	const toggleFlexVisibility = () => {
		setIsFlexVisible((prev) => !prev);
	};
	return (
		<Layout>
			<div className={styles.container}>
				{isActive ? <Loading /> : null}

				<MessagePlate MessageRecord={clickedObjectInfo} />

				<div
					className={styles.post__area}
					style={{ display: isFlexVisible ? "none" : "flex" }}
				>
					<PostForm onPostCreated={handlePostCreated} SetActive={SetActivate} />	
					<button
							className={`${styles.button} ${styles.post__areButton}`}
							type="button"
							onClick={toggleFlexVisibility}
							style={{opacity: isFlexVisible ? 0.0 : 1.0 }}
						>
							{isFlexVisible ? (
								<Image
									src="/icons/post-svgrepo-com.svg"
									alt="Open Icon"
									width={24}
									height={24}
									className={styles.icon}
								/>
							) : (
								"X"
							)}
						</button>
					
					
				</div>

				<canvas ref={canvasRef} className={styles.canvas} id="canvas" />

				<div
					className={`${styles.form__container}  ${isFlexVisible ? styles.activate : styles.inactivate}`}
				>
					<div className={styles.flex}>
						<button
							className={styles.button}
							type="button"
							onClick={toggleFlexVisibility}
							style={{ opacity: isFlexVisible ? 1.0 : 0.5 }}
						>
							{isFlexVisible ? (
								<Image
									src="/icons/post-svgrepo-com.svg"
									alt="Open Icon"
									width={24}
									height={24}
									className={styles.icon}
								/>
							) : (
								"X"
							)}
						</button>
						<Links className={styles.links} />
					</div>
				</div>
			</div>
		</Layout>
	);
};
export default Home;
