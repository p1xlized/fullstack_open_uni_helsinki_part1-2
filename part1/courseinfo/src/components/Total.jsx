function Total({ course }) {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
}

export default Total;
