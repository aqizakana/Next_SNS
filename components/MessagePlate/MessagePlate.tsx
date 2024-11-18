import { useEffect, useState } from "react";
import styles from "./MessagePlate.module.css";

type MessageRecordItem = {
	content: string;
	createdAt: Date;
	username: string;
};

type MessagePlateProps = {
	MessageRecord: MessageRecordItem | null; // 単一のオブジェクトまたはnull
	className?: string; // className prop added
};

export const MessagePlate: React.FC<MessagePlateProps> = ({
	MessageRecord,
}) => {
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
				<div className={styles.says}>
					<p className={styles.content}>
						<strong>メッセージ:</strong> {objectInfo.content}
					</p>
					<p className={styles.metadata}>
						<strong>ユーザー名:</strong> {objectInfo.username}
					</p>
					<p className={styles.metadata}>
						<strong>投稿日時:</strong>{" "}
						{objectInfo.createdAt ? formatDate(objectInfo.createdAt) : ""}
					</p>
				</div>
			) : (
				<p>オブジェクトをクリックすると情報が表示されます</p>
			)}
		</div>
	);
};
