import { useEffect, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Pill from "./pill";
import "../App.css";

// eslint-disable-next-line react/prop-types
function MultiSelect({ fetchUrl, placeholder }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemSet, setSelectedItemSet] = useState(new Set());
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const inputRef = useRef(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchItems = () => {
      setActiveSuggestion(0);
      if (debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }
      fetch(`${fetchUrl}?q=${debouncedSearchTerm}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => {
        console.error(err);
      });
  };

    fetchItems();
    }, [debouncedSearchTerm, fetchUrl]);

    const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, item]);
    setSelectedItemSet(new Set([...selectedItemSet, item.email]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveItem = (item) => {
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem.id !== item.id
    );
    setSelectedItems(updatedItems);

    const updatedEmails = new Set(selectedItemSet);
    updatedEmails.delete(item.email);
    setSelectedItemSet(updatedEmails);
};

const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedItems.length > 0
    ) {
      const lastUser = selectedItems[selectedItems.length - 1];
      handleRemoveItem(lastUser);
      setSuggestions([]);
    } else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) =>
        prevIndex < suggestions.users.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.users.length
    ) {
      handleSelectItem(suggestions.users[activeSuggestion]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedItems.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveItem(user)}
            />
          );
        })}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
          />
          {/* Search Suggestions */}
          <ul className="suggestions-list">
            {suggestions?.users?.map((user, index) => {
              return !selectedItemSet.has(user.email) ? (
                <li
                  className={index === activeSuggestion ? "active" : ""}
                  key={user.email}
                  onClick={() => handleSelectItem(user)}
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MultiSelect;