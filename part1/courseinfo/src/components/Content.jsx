import Part from "./Part";

// 2. This is the Content component that App.jsx is actually importing
const Content = (props) => {
  return (
    <div>
      {
        props.course.parts.map((part) => (
          <Part key={part.name} part={part.name} exercises={part.exercises} />
        ))
      }
      {/* <Part part={props.part1} exercises={props.exercises1} />
      <Part part={props.part2} exercises={props.exercises2} />
      <Part part={props.part3} exercises={props.exercises3} />*/}
    </div>
  );
};

export default Content;
