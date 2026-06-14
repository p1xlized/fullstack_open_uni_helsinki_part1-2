import StatisticLine from "./StatisticLine";
const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad;
  return (
    <div>
      {total === 0 ? (
        <p>No feedback given</p>
      ) : (
        <div>
          <h1>statistics</h1>
          <table>
            <tbody>
              <StatisticLine text="good" value={props.good} />
              <StatisticLine text="neutral" value={props.neutral} />
              <StatisticLine text="bad" value={props.bad} />
              <StatisticLine text="all" value={total} />
              <StatisticLine
                text="average"
                value={(props.good - props.bad) / total}
              />
              <StatisticLine
                text="positive"
                value={(props.good / total) * 100 + " %"}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Statistics;
