import Header from "./Header";
import Part from "./Part";
function Course({ course }) {
  return (
    <div>
      <Header course={course.name} />
      {course.parts.map((part) => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      ))}
      {/* <Total total={exercises1 + exercises2 + exercises3} />*/}
      <p>
        <b>Number of exercises:</b>{" "}
        {course.parts.reduce((sum, part) => sum + part.exercises, 0)}
      </p>
    </div>
  );
}

export default Course;
