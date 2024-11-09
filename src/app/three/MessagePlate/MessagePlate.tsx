import { useEffect, useState } from "react";
import { AnalysisResult } from "../objects/Shape/type";
import styles from "./MessagePlate.module.css";

type MessageRecordItem = {
	content: string;
	created_at: Date;
	username: string;
	geometry: any;
	material: any;
	mesh: any;
};

type MessagePlateProps = {
	MessageRecord: MessageRecordItem | null; // 単一のオブジェクトまたはnull
};

const MessagePlate: React.FC<MessagePlateProps> = ({ MessageRecord }) => {
	const [objectInfo, setObjectInfo] = useState<MessageRecordItem | null>(null);

	useEffect(() => {
		setObjectInfo(MessageRecord);
		console.log("MessageRecord", MessageRecord);
	}, [MessageRecord]);

	// 日付をフォーマットする関数
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};
	console.log("objectInfo", objectInfo);
	return (
		<div className={styles.messagePlate}>
			{objectInfo ? (
				<div>
					<h2 className={styles.title}>オブジェクト情報</h2>
					<div className={styles.messageItem}>
						<p className={styles.content}>
							<strong>メッセージ:</strong> {objectInfo.content}
						</p>
						<p className={styles.metadata}>
							<strong>ユーザー名:</strong> {objectInfo.username}
						</p>
						<p className={styles.metadata}>
							<strong>投稿日時:</strong>{" "}
							{objectInfo.created_at ? formatDate(objectInfo.created_at) : ""}
						</p>
					</div>
				</div>
			) : (
				<p>オブジェクトをクリックすると情報が表示されます</p>
			)}
		</div>
	);
};

export default MessagePlate;
