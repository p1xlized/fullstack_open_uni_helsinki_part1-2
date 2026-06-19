const PersonForm = ({
  onSubmit,
  nameValue,
  onNameChange,
  numberValue,
  onNumberChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={onNameChange} required />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberChange} required />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
