import { useEffect, useState } from 'react';

import './index.css';

const BASE_URL = 'http://localhost:8000';

const Topic = ({ timeAgo }) => {
  const params = new URL(document.location).searchParams;

  const topicId = params.get('id');

  const [topic, setTopic] = useState('');
  const [comment, setComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  useEffect(() => {
    const fetchTopic = async () => {
      const response = await fetch(`${BASE_URL}/v1/comments`);

      if (response?.ok) {
        const { success, comments } = await response.json();

        if (success && comments[topicId]) {
          setTopic(comments[topicId]);
        }
      }
    };

    fetchTopic();
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
    setComment('');
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

  const onClickPostComment = openOverlay;

  const onClickPost = async () => {
    const response = await fetch(`${BASE_URL}/v1/comment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topicId,
        text: comment
      })
    });

    if (response?.ok) {
      const { success } = await response.json();

      if (success) {
        alert('Your comment has been posted!');
        window.location.reload();
      }
    }
  };

  const onChangeComment = ({ target: { value }}) => setComment(value);

  return <>
    <header className="breadcrumbs">
      <a href="/forum">forum</a>&nbsp;/&nbsp;<em>{topicId}</em>
    </header>
    {isPosting && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <div className="form">
        <h2>Post Comment</h2>
        <input
          required
          disabled={!isPosting}
          placeholder="Write a comment (up to 8,000 characters)"
          onChange={onChangeComment}
          value={comment}
        />
        <button disabled={!isPosting} onClick={onClickPost}>
          Post
        </button>
      </div>
    </aside>}
    <article>
      {topic && <div className="topic">
        <h2>{topic.topic}</h2>
        <div className="author">
          <h6>Posted by {topic.authorName}</h6>&nbsp;
          <em>{timeAgo.format(new Date(topic.createdAt))}</em>
        </div>
        <p>{topic.text}</p>
        <ul>
          {Object.values(topic.comments).map(({
            id,
            authorName,
            text,
            createdAt
          }) => (
            <li className="comment" key={id}>
              <span className="author">
                <h6>Commented by {authorName}</h6>&nbsp;
                <em>{timeAgo.format(new Date(createdAt))}</em>
              </span>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>}
    </article>
    <button disabled={isPosting} onClick={onClickPostComment}>Post Comment</button>
  </>;
};

export default Topic;
