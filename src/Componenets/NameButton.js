export const NameButton = (props) => {
  const { uid, date, skill, nickname, list, setList, visibility } = props;


  // Check if the current combination exists in the list
  const isActive = list.some(
    (item) => item.uid === uid && item.date === date && item.skill === skill
  );

  return (
    <span
      className={`cursor-pointer mx-1 px-1 ${
        isActive
          ? "bg-teal-400/20 border-2 border-teal-400"
          : "bg-gray-200 border-2 border-transparent"
      } rounded-md`}
      onClick={() => {
        console.log(uid, date, skill);
        // Toggle the combination in the list state
        if (isActive) {
          setList((prevList) =>
            prevList.filter(
              (item) =>
                !(
                  item.uid === uid &&
                  item.date === date &&
                  item.skill === skill
                )
            )
          );
        } else {
          setList((prevList) => [...prevList, { uid, date, skill }]);
        }
      }}
    >
      {nickname}
    </span>
  );
};
