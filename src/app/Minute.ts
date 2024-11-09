//直近60秒間、60分の累積カウントを返す。
//例えば、帯域幅の使用状況を確認するのに使える。
class MinuteHourCounter {
  private hour_events: number[] = new Array(3600);
  private minute_events: number[] = new Array(60);
  private minute_count = 0;
  private hour_count = 0;

  //新しいデータを追加する(count >= 0)
  //それから1分間は、MinuteCount()の返す値が+countだけ増加する
  //それから、1時間は、HourCount()の返す値が+countだけ増加する
  public Add(count: number): void {
    const time_t = Math.floor(Date.now() / 1000);
    const now_secs = time_t % 3600;

    this.minute_events.push(count);
  }
}
