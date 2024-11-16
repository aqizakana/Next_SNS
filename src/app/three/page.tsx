"use client";

import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";

import Loading from "../../../components/Loading";
import MessagePlate from "../../../components/MessagePlate/MessagePlate";
import PostForm from "../../../components/PostForm/PostForm";
import { AddObject } from "./objects/AddObject";
import type { Prototypes } from "./objects/Shape/Prototype";
import { Sphere3 } from "./objects/Shape/Sphere/Sphere3";
//型
import {
	type backgroundProps,
	initializeScene,
	objectToProps,
} from "./objects/initializeScene";
import type { AnalysisResult, MessageRecordItem, psqlProps } from "./type";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Home: NextPage = () => {
	const [username, setUsername] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
	const backgroundRef = useRef<backgroundProps | null>(null);
	const [loadedPosts, setLoadedPosts] = useState<psqlProps[]>([]);
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

	const loadPreviousObject = (object: psqlProps) => {
		if (!backgroundRef.current) return;

		const analysisResult: AnalysisResult = {
			status: 200,
			username: object.username,
			content: object.content,
			charCount: object.charCount_result,
			bert: {
				result: {
					sentiment: object.analyze_8labels_result.sentiment,
				},
			},
			date: new Date(object.created_at),
			koh_sentiment: [
				{
					label: object.koheiduck_sentiment_label,
					score: object.koheiduck_sentiment_score,
				},
			],
		};

		const addObjectInstance = new AddObject(analysisResult);
		const newObject = addObjectInstance.determineObjectAndMaterial();

		if (newObject) {
			objectsToUpdate.current.push(newObject);
			backgroundRef.current.scene.add(newObject.getMesh());
			if (username === object.username) {
				const Sphere = addObjectInstance.OwnObject();
				Sphere.position.set(
					-addObjectInstance.PosX,
					addObjectInstance.PosY,
					-addObjectInstance.PosZ,
				);
				backgroundRef.current.scene.add(Sphere);
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
			if (username === analysisResult.username) {
				const Sphere = addObjectInstance.OwnObject();
				Sphere.position.set(
					-addObjectInstance.PosX,
					addObjectInstance.PosY,
					-addObjectInstance.PosZ,
				);
				backgroundRef.current.scene.add(Sphere);
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
		<div className={styles.container}>
			{isActive ? <Loading /> : null}
			<MessagePlate MessageRecord={clickedObjectInfo} />
			<canvas ref={canvasRef} className={styles.canvas} id="canvas" />

			<div className={styles.formContainer}>
				<div
					className={styles.formWrapper}
					style={{ opacity: isFlexVisible ? 0.0 : 1.0 }}
				>
					<PostForm onPostCreated={handlePostCreated} SetActive={SetActivate} />
				</div>
				<button
					className={styles.button}
					type="button"
					onClick={toggleFlexVisibility}
					style={{ opacity: isFlexVisible ? 1.0 : 0.5 }}
				>
					{isFlexVisible ? "Open" : "Close"}
				</button>
			</div>
		</div>
	);
};
export default Home;
