"use client";

import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Loading } from "../../../components/Loading";
import { MessagePlate } from "../../../components/MessagePlate/MessagePlate";
import Links from "../../../components/FilterButton/Links";
import FilterButton from "../../../components/FilterButton/FilterButton";
import PostForm from "../../../components/PostForm/PostForm";
import Image from "next/image";
import Layout from "../layout";
import styles from "./page.module.css";
import { AddObject } from "./objects/AddObject";
import type { Prototypes } from "./objects/Shape/Prototype";
import { Circle } from "./objects/Shape/Circle"; // Add this line to import Circle

//型
import {
	type backgroundProps,
	initializeScene,
} from "./objects/initializeScene";
import type { AnalysisResult, MessageRecordItem, PsqlProps } from "./type";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Home: NextPage = () => {
	const [username, setUsername] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const backgroundRef = useRef<backgroundProps | null>(null);
	const [loadedPosts, setLoadedPosts] = useState<PsqlProps[]>([]);
	const [filter, setFilteredPosts] = useState<PsqlProps[]>([]);
	const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
	const objectsToUpdate = useRef<Prototypes[]>([]);
	const objectsToAnimate = useRef<Prototypes[]>([]);
	const [clickedObjectInfo, setClickedObjectInfo] =
		useState<MessageRecordItem | null>(null);
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isFlexVisible, setIsFlexVisible] = useState(true);
	const [isPost, setIsPost] = useState(false);
	const [isFiltering, setIsFiltering] = useState(false);

	// ユーザー情報取得
	useEffect(() => {
		const initialize = async () => {
			try {
				const [userInfoResponse, postsResponse] = await Promise.all([
					axios.get(`${apiBaseUrl}/api/v1/accounts/userinfo/`, {
						headers: {
							Authorization: `Token ${localStorage.getItem("token")}`,
						},
					}),
					axios.get(`${apiBaseUrl}/api/v1/posts/SetGet/`),
				]);

				setUsername(userInfoResponse.data.username);
				setLoadedPosts(postsResponse.data);
				setFilteredPosts(postsResponse.data);
			} catch (error) {
				console.error("Error during initialization:", error);
			}
		};

		initialize();
	}, []);

	useEffect(() => {
		if (!canvasRef.current) return undefined;
		const background = initializeScene(canvasRef.current);
		backgroundRef.current = background;
		background.animate(objectsToUpdate.current);
		background.animate(objectsToAnimate.current);
		const threeCanvas: HTMLElement | null = document.getElementById("canvas");


		let handleClick: () => void;
		for (const object of filter) {
			loadPreviousObject(object);
			handleClick = () => logClickedObject();
			threeCanvas?.addEventListener("click", handleClick);
		}
		backgroundRef.current.renderer.render(
			backgroundRef.current.scene,
			backgroundRef.current.camera,
		);

		return () => {
			background.dispose();
			removeEventListener("click", handleClick);
			threeCanvas?.removeEventListener("click", handleClick);
		};
	}, [filter,]);

	const processNewObject = (analysisResult: AnalysisResult) => {
		const addObjectInstance = new AddObject(analysisResult);
		const newObject = addObjectInstance.determineObjectAndMaterial();
		newObject
			.getMesh()
			.position.set(
				addObjectInstance.PosX,
				addObjectInstance.PosY,
				addObjectInstance.PosZ,
			);

		objectsToUpdate.current.push(newObject);
		objectsToAnimate.current.push(newObject);
		backgroundRef.current?.scene.add(newObject.getMesh());

		if (newObject.getMesh().position.y > 150) {
			backgroundRef.current?.scene.remove(newObject.getMesh());
		}

		return { addObjectInstance, newObject };
	};

	const processCircle = (
		newObject: Prototypes,
		addObjectInstance: AddObject,
	) => {
		const Circle = addObjectInstance.OwnObject();

		Circle.getMesh().position.set(
			addObjectInstance.PosX,
			addObjectInstance.PosY,
			addObjectInstance.PosZ,
		);
		const objDate = newObject.returnCreatedAt();
		Circle.returnCreatedAt(objDate);

		objectsToAnimate.current.push(Circle as unknown as Prototypes);
		objectsToUpdate.current.push(Circle as unknown as Prototypes);
		backgroundRef.current?.scene.add(Circle.getMesh());

		if (newObject === objectsToUpdate.current[0]) {
			const ownFlag = true;
			const material = Circle.getMaterial(ownFlag);
			Circle.getMesh().material = material;
		}

		const updateCirclePosition = () => {
			Circle.update(newObject.getMesh().position);
		};

		if (newObject.getMesh().position.y > 500) {
			backgroundRef.current?.scene.remove(Circle.getMesh());
		}

		requestAnimationFrame(updateCirclePosition);

		return Circle;
	};

	const loadPreviousObject = async (object: PsqlProps) => {
		if (!backgroundRef.current || !username) return;
		const analysisResult: AnalysisResult = {
			ID: object.ID,
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

		if (analysisResult) {
			const { addObjectInstance, newObject } = processNewObject(analysisResult);
			let Circle = null;
			if (
				username === object.username &&
				newObject === objectsToUpdate.current[0]
			) {
				Circle = processCircle(newObject, addObjectInstance);
			}
			return { newObject, Circle };
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
				const Circle = addObjectInstance.OwnObject();
				/* Circle.getMesh().position.set(
					addObjectInstance.PosX,
					addObjectInstance.PosY,
					addObjectInstance.PosZ,
				); */

				if (newObject === objectsToUpdate.current[0]) {
					const ownFlag = true;
					const material = Circle.getMaterial(ownFlag);
					Circle.getMesh().material = material;
				}

				// Meshを削除する前に位置を同期
				if (newObject.getMesh().position.y > 0) {
					Circle.getMesh().position.copy(newObject.getMesh().position);
					backgroundRef.current.scene.remove(newObject.getMesh());
				}
				const updateCirclePosition = () => {
					Circle.update(newObject.getMesh().position);
				};

				requestAnimationFrame(updateCirclePosition);

				backgroundRef.current.scene.add(Circle.getMesh());
			}
		}
		if (newObject.getMesh().position.y > 500) {
			backgroundRef.current.scene.remove(newObject.getMesh());
		}
	};

	const logClickedObject = () => {
		if (!backgroundRef.current) return;
		const clickedObject = backgroundRef.current.clickObject();
		const addObjectInstance = objectsToUpdate.current.find(
			(obj) => obj.getMesh() === clickedObject && !(obj instanceof Circle),
		);
		if (addObjectInstance) {
			setClickedObjectInfo(addObjectInstance);
		}

		return clickedObject;
	};

	const handlePostCreated = (newPost: AnalysisResult) => {
		setAnalysisResults((prevResults) => [...prevResults, newPost]);
		addObjectToScene(newPost);
		setIsActive(true);
		setTimeout(() => {
			setIsActive(false);
		}, 2000);

		setIsFlexVisible(true);
	};

	const toggleFlexVisibility = () => {
		setIsFlexVisible((prev) => !prev);
	};

	const [clickCount, setClickCount] = useState(0);
	
	const filterMine = () => {
		setIsFiltering((prev) => !prev);
		if (!isFiltering) {
			setFilteredPosts(loadedPosts.filter((post) => post.username === username));
		} else {
			setFilteredPosts(loadedPosts);
		}
	};


	return (
		<Layout>
			<div className={styles.container}>
				{isActive ? <Loading /> : null}

				<MessagePlate MessageRecord={clickedObjectInfo} />

				{!isPost ? (
					<div
						className={styles.post__area}
						style={{ display: isFlexVisible ? "none" : "flex" }}
					>
						<PostForm
							onPostCreated={handlePostCreated}
							SetActive={setIsActive}
							SetIsPost={setIsPost}
							setIsFlexVisible={setIsFlexVisible}
						/>
					</div>
				) : null}

				<canvas ref={canvasRef} className={styles.canvas} id="canvas" />

				<div
					className={`${styles.form__container}  ${isFlexVisible ? styles.activate : styles.inactivate}`}
				>
					<button
						className={styles.button}
						type="button"
						onClick={toggleFlexVisibility}
						style={{ opacity: isFlexVisible ? 1.0 : 0.5 }}
					>
						{isFlexVisible ? (
							<Image
								src="/icons/pen-square-svgrepo-com.svg"
								alt="Open Icon"
								width={24}
								height={24}
								className={styles.icon}
							/>
						) : (
							"X"
						)}
					</button>
					<button type="button" className={styles.button} onClick={filterMine}>
						Filter
					</button>
					<div className={styles.flex}>
						<Links className={styles.links} />
					</div>
				</div>
			</div>
		</Layout>
	);
};
export default Home;
