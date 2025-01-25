import { useNavigate, useParams } from "react-router-dom";
import CoursesIcon from "../../components/icons/CoursesIcon";
import { formatDate } from "../../lib/formatDate";
import VideoActionButton from "../../components/app/VideoActionButton";
import CheckMark from "../../components/icons/CheckMark";
import SavedIcon from "../../components/icons/SavedIcon";
import CommentIcon from "../../components/icons/CommentIcon";
import BaseButton from "../../components/BaseButton";
import { useEffect, useState } from "react";
import Comment from "../../components/app/Comment";
import request from "../../lib/request";

export default function VideoPage() {
  const { videoID } = useParams();
  const navigate = useNavigate();
  const [showCommentButtons, setShowCommentButtons] = useState(false);
  const [showAnswersIds, setShowAnswersIds] = useState<number[]>([]);
  const [answerModal, setAnswerModal] = useState<number | null>(null);
  const [reportModal, setReportModal] = useState<number | null>(null);
  const [videoComments, setVideoComments] = useState([]);
  const [videoInformation, setVideoInformation] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      const res = await request(`api/video/${videoID}/comments`);

      if (res.error) {
        console.error(res.error);
      } else {
        setVideoComments(res);
      }
    }

    async function fetchVideoInformation() {
      const res = await request(`api/video/${videoID}/information`);

      if (res.error) {
        console.error(res.error);
      } else {
        setVideoInformation(res.information);
      }
    }

    fetchComments();
    fetchVideoInformation();
  }, []);

  const comments = [
    {
      id: 1,
      author: "Wim Titzdam",
      content: "This is a great video!",
      createdAt: new Date(),
      likes: 12,
      answers: [
        {
          id: 2,
          author: "Wim Titzdam",
          content: "This is a great video!",
          createdAt: new Date(),
          likes: 12,
        },
        {
          id: 3,
          author: "Wim Titzdam",
          content: "This is a great video!",
          createdAt: new Date(),
          likes: 12,
        },
        {
          id: 4,
          author: "Wim Titzdam",
          content: "This is a great video!",
          createdAt: new Date(),
          likes: 12,
        },
      ],
    },
    {
      id: 300,
      author: "Wim Titzdam",
      content: "This is a great video!",
      createdAt: new Date(),
      likes: 12,
      answers: [
        {
          id: 20,
          author: "Wim Titzdam",
          content: "This is a great video!",
          createdAt: new Date(),
          likes: 12,
        },
        {
          id: 30,
          author: "Wim Titzdam",
          content: "This is a great video!",
          createdAt: new Date(),
          likes: 12,
        },
        {
          id: 40,
          author: "Wim Titzdam",
          content: "This is a great video!",
          createdAt: new Date(),
          likes: 12,
        },
      ],
    },
  ];

  async function markAsRead() {
    await request(`api/user/seen`, {
      method: "POST",
      body: JSON.stringify({ videoId: videoID }),
    });
  }

  async function addToSaved() {
    await request(`api/user/watchlater`, {
      method: "POST",
      body: JSON.stringify({ videoId: videoID }),
    });
  }

  function handleNewCommentFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    setShowCommentButtons(e.type === "focus");
  }

  function handleNewCommentBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    setTimeout(() => {
      const clickedElement = document.activeElement;
      const buttonsContainer = document.getElementById("comment-buttons");
      if (!buttonsContainer?.contains(clickedElement)) {
        setShowCommentButtons(false);
      }
    }, 0);
  }

  function handleNewCommentCancel() {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = "";
    }
    setShowCommentButtons(false);
  }

  function handleNewCommentSubmit() {
    console.log("Comment submitted");
  }

  function handleLike(id: number) {
    console.log("Like comment", id);
  }

  function handleAnswerCancel() {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = "";
    }
    setAnswerModal(null);
  }

  function handleAnswerSubmit() {
    console.log("Answer submitted", answerModal);
  }

  function handleReportCancel() {
    setReportModal(null);
  }

  function handleReportSubmit() {
    console.log("Report submitted", reportModal);
  }

  async function handleProgress(e: any) {
    const progressPercentage = e.target.currentTime / e.target.duration;
    if (progressPercentage > 0.9) {
      await request(`api/user/seen`, {
        method: "POST",
        body: JSON.stringify({ videoId: videoID }),
      });
    }
  }

  return (
    <div className="max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="xl:flex">
        <div className="xl:basis-4/5">
          <video className="w-full" controls onProgress={handleProgress}>
            <source
              src={`${import.meta.env.VITE_BACKEND_URL}/api/video/stream/${videoID}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="px-3 pb-4 border-b border-border-100">
            <h1 className="text-2xl font-medium mt-5">
              {videoInformation?.video?.title}
            </h1>
            <span className="text-gray">
              Hochgeladen {formatDate(videoInformation?.video?.creationDate)}
            </span>
          </div>
          <div className="px-3 grid grid-cols-3 gap-3 py-3 border-b border-border-100 xl:border-0">
            <VideoActionButton
              icon={<CoursesIcon />}
              text="Kurs ansehen"
              onClick={() =>
                navigate(`/app/courses/${videoInformation?.course[0]?._id}`)
              }
            />
            <VideoActionButton
              icon={<CheckMark />}
              text="Als gesehen makieren"
              onClick={markAsRead}
            />
            <VideoActionButton
              icon={<SavedIcon />}
              text="Für später speichern"
              onClick={addToSaved}
            />
          </div>
        </div>
        <div>
          <div className="xl:border-b border-border-100 px-3">
            <div className="flex items-center gap-2 mt-5 xl:mt-3">
              <div className="text-primary">
                <CommentIcon />
              </div>
              <h2 className="text-xl font-medium">Kommentare</h2>
            </div>
            <textarea
              className="border border-border-100 w-full my-3 p-3 rounded-xl outline-none resize-none focus:border-primary"
              cols={30}
              rows={3}
              placeholder="Neues Kommentar verfassen..."
              onFocus={handleNewCommentFocus}
              onBlur={handleNewCommentBlur}
            />
            {showCommentButtons && (
              <div
                id="comment-buttons"
                className="flex items-center gap-4 ml-auto w-fit mb-3"
              >
                <button onClick={handleNewCommentCancel}>Abbrechen</button>
                <BaseButton onClick={handleNewCommentSubmit}>
                  Kommentieren
                </BaseButton>
              </div>
            )}
          </div>
          <div className="mt-8 px-3 grid gap-10">
            {comments.map((comment) => (
              <div key={comment.id}>
                <Comment
                  id={comment.id}
                  author={comment.author}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  likes={comment.likes}
                  onLike={handleLike}
                  onAnswer={(id) => setAnswerModal(id)}
                  onReport={(id) => setReportModal(id)}
                />
                {showAnswersIds.includes(comment.id) ? (
                  <div className="ml-10 mt-6 grid gap-6">
                    {comment.answers.map((answer) => (
                      <Comment
                        key={answer.id}
                        id={answer.id}
                        author={answer.author}
                        content={answer.content}
                        createdAt={answer.createdAt}
                        likes={answer.likes}
                        onLike={handleLike}
                        onAnswer={(id) => setAnswerModal(id)}
                        onReport={(id) => setReportModal(id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center mt-4">
                    <BaseButton
                      type="rounded"
                      onClick={() =>
                        setShowAnswersIds([...showAnswersIds, comment.id])
                      }
                    >
                      Alle Antworten anzeigen
                    </BaseButton>
                  </div>
                )}
              </div>
            ))}
          </div>
          {answerModal !== null && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 grid place-content-center px-3 z-50">
              <div className="bg-white rounded-xl border border-100 p-3">
                <textarea
                  className="border border-border-100 w-full mb-3 p-3 rounded-xl outline-none resize-none focus:border-primary"
                  cols={30}
                  rows={5}
                  placeholder="Neues Kommentar verfassen..."
                />
                <div
                  id="comment-buttons"
                  className="flex items-center gap-4 ml-auto w-fit"
                >
                  <button onClick={handleAnswerCancel}>Abbrechen</button>
                  <BaseButton onClick={handleAnswerSubmit}>
                    Kommentieren
                  </BaseButton>
                </div>
              </div>
            </div>
          )}
          {reportModal !== null && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 grid place-content-center px-3 z-50">
              <div className="bg-white rounded-xl border border-100 p-3">
                <p className="mb-4">
                  Bist du sicher, dass du diesen Kommentar melden möchtest?
                </p>
                <div className="flex items-center gap-4 ml-auto w-fit">
                  <button onClick={handleReportCancel}>Abbrechen</button>
                  <BaseButton onClick={handleReportSubmit}>Melden</BaseButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
