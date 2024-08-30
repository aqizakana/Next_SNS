import React from 'react';
import styles from './result.module.css';

interface AnalysisResult {
    status: number;
    text: string;
    topic: any;
    sentiment: any;
    MLAsk: any;
    textBlob:any;
    cohereParaphrase:any;
  }

interface ResultCardListProps {
    analysisResults: AnalysisResult[];
  }
  

export default function ResultCard({ text, label, char_count, score, MLAsk, textBlob,cohereParaphrase }: { text: string; label: string; char_count: number; score: string; MLAsk: any; textBlob: any;cohereParaphrase:string}) {
    //console.log("ResultCardに渡されたMLAskデータ:", MLAsk);
    return (
        <div className={styles.resultCard}>
            <p><strong>変換後テキスト:</strong> {cohereParaphrase}</p>
            <p><strong>文字数:</strong> {char_count}</p>
            <p><strong>ラベル:</strong> {label}</p>
            <p><strong>スコア:</strong> {score}</p>
            
            <p><strong>textBlob:</strong></p>
            <ul>

           
                {textBlob.map((blob: string, index: number) => (
                    <li key={index}>
                        {index}: {blob} 
                </li>
    ))}
    </ul>
            <ul>
    {/* 感情の種類ごとに出力を表示 */}
    <p><strong>MLAsk:</strong></p>
    {MLAsk && MLAsk.emotion && (
        <>
            {MLAsk.emotion?.yorokobi?.length > 0 && (
                <li>喜び: {MLAsk.emotion.yorokobi.join(', ')}</li>
            )}
            {MLAsk.emotion?.ikari?.length > 0 && (
                <li>怒り: {MLAsk.emotion.ikari.join(', ')}</li>
            )}
            {MLAsk.emotion?.kanashimi?.length > 0 && (
                <li>悲しみ: {MLAsk.emotion.kanashimi.join(', ')}</li>
            )}
            {MLAsk.emotion?.odoroki?.length > 0 && (
                <li>驚き: {MLAsk.emotion.odoroki.join(', ')}</li>
            )}
            {MLAsk.emotion?.iya?.length > 0 && (
                <li>嫌い: {MLAsk.emotion.iya.join(', ')}</li>
            )}
            {MLAsk.emotion?.suki?.length > 0 && (
                <li>好き: {MLAsk.emotion.suki.join(', ')}</li>
            )}
            
            {MLAsk.orientation && (
                <li>方向性: {MLAsk.orientation}</li>
            )}
            {MLAsk.activation && (
                <li>活性化: {MLAsk.activation}</li>
            )}
            {MLAsk.emoticon && (
                <li>絵文字: {MLAsk.emoticon}</li>
            )}
            {MLAsk.intension && (
                <li>意図: {MLAsk.intension}</li>
            )}
            
            <li>強調表現:</li>
            <ul>
                {MLAsk.intensifier?.interjections?.length > 0 && (
                    <li>間投詞: {MLAsk.intensifier.interjections.join(', ')}</li>
                )}
                {MLAsk.intensifier?.gitaigo?.length > 0 && (
                    <li>擬態語: {MLAsk.intensifier.gitaigo.join(', ')}</li>
                )}
            </ul>
            {MLAsk.representative?.[0] && (
                <li>代表感情: {MLAsk.representative[0]} ({MLAsk.representative[1]?.join(', ') || 'なし'})</li>
            )}
            
        </>
    )}
</ul>
        </div>
    );
}

export const ResultCardList: React.FC<ResultCardListProps> = ({ analysisResults }) => {
    
    return (
        <div className={styles.resultCardList}>
            {analysisResults.map((result, index) => (
                <ResultCard
                    key={index}
                    text={result.text}
                    char_count={result.topic.character_count}
                    label={result.sentiment[0].label}
                    score={result.sentiment[0].score.toFixed(2)}
                    MLAsk={result.MLAsk}
                    textBlob={result.textBlob.noun_phrases}
                    cohereParaphrase={result.cohereParaphrase}
                />
            ))}
        </div>
    );
}

/* translated_text The dinner was delicious and my friends were happy. Thank you very much. The  
room was friendly and polite. The breakfast was just as good as expected. The room was better than 
expected. */