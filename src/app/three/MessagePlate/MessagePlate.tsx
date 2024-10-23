import { useState, useEffect } from 'react';
import { AnalysisResult } from '../objects/Shape/type';
import styles from './MessagePlate.module.css';

type MessagePlateProps = {
    MessageRecord: any[];  // objectInfoを配列で受け取る
}

const MessagePlate: React.FC<MessagePlateProps> = ({ MessageRecord }) => {
    const [objectInfo, setObjectInfo] = useState<any[]>([]);
    const ListInfo = objectInfo[1];

    useEffect(() => {
        setObjectInfo(MessageRecord); // MessageRecordの更新に応じてobjectInfoを更新

    }, [MessageRecord]);  // MessageRecordの変更を監視

    return (
        <div className={styles.messagePlate}>
            {/* ListInfoがオブジェクトである場合、各プロパティを個別に表示 */}
            {ListInfo ? (
                <div>
                    <p><strong>Username:</strong> {ListInfo.username}</p>
                    <p><strong>Content:</strong> {ListInfo.content}</p>
                    <p><strong>Character Count:</strong> {ListInfo.charCount}</p>
                    <p><strong>Sentiment (BERT):</strong> {ListInfo.bertLabel}</p>
                    <p><strong>Sentiment Label (Koheiduck):</strong> {ListInfo.koh_sentiment_label_number}</p>
                    <p><strong>Sentiment Score (Koheiduck):</strong> {ListInfo.koh_sentiment_score}</p>
                    <p><strong>Created At:</strong> {ListInfo.created_at}</p>
                </div>
            ) : (
                <p>No information available</p>
            )}
        </div>
    );
}

export default MessagePlate;
