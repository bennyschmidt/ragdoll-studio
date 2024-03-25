import { useEffect, useState } from 'react';

import './index.css';

const BASE_URL = 'http://localhost:8000';

const Topics = ({ timeAgo }) => {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await fetch(`${BASE_URL}/v1/comments`);

      if (response?.ok) {
        const { comments } = await response.json();

        setTopics(comments);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  const openOverlay = () => {
    setIsPosting(true);
    setOverlayClassName('');

    requestAnimationFrame(() => {
      setOverlayClassName('show');
    });
  };

  const closeOverlay = () => {
    setTopic('');
    setText('');
    setOverlayClassName('');

    setTimeoutId(
      setTimeout(() => {
        setIsPosting(false);
      }, 1000)
    );
  };

  const onClickOverlay = ({ target: { id }}) => {
    if (id === 'overlay') {
      closeOverlay();
    }
  };

  const onClickCreateTopic = openOverlay;

  const onClickPost = async () => {
    const response = await fetch(`${BASE_URL}/v1/topic`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        text
      })
    });

    if (response?.ok) {
      const { success } = await response.json();

      if (success) {
        alert('Your topic has been posted!');
        window.location.reload();
      }
    }
  };

  const onChangeTopic = ({ target: { value }}) => setTopic(value);

  const onChangeText = ({ target: { value }}) => setText(value);

  return <>
    <header className="breadcrumbs">
      <em>forum</em>
    </header>
    {isPosting && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <div className="form">
        <h2>Create Topic</h2>
        <input
          required
          disabled={!isPosting}
          placeholder="Write a topic (up to 900 characters)"
          onChange={onChangeTopic}
          value={topic}
        />
        <input
          required
          disabled={!isPosting}
          placeholder="Write some supporting text (up to 8,000 characters)"
          onChange={onChangeText}
          value={text}
        />
        <button disabled={!isPosting} onClick={onClickPost}>
          Post
        </button>
      </div>
    </aside>}
    <ul>
      {Object.values(topics).map(({
        id,
        topic: topicText,
        createdAt,
        comments
      }) => {
        const commentLength = Object.values(comments)?.length << 0;

        return (
          <li className="topic" key={id}>
            <a href={`/forum/topic?id=${id}`}>{topicText}</a> - {commentLength} comment{commentLength === 1 ? '' : 's'} - <em>{timeAgo.format(new Date(createdAt))}</em>
          </li>
        );
      })}
    </ul>
    <button disabled={isPosting} onClick={onClickCreateTopic}>Create Topic</button>
  </>;
};

export default Topics;
