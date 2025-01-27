import { useNavigate, useParams } from "react-router-dom";
import CoursesIcon from "../../components/icons/CoursesIcon";
import { formatDate } from "../../lib/formatDate";
import VideoActionButton from "../../components/app/VideoActionButton";
import CheckMark from "../../components/icons/CheckMark";
import SavedIcon from "../../components/icons/SavedIcon";
import CommentIcon from "../../components/icons/CommentIcon";
import BaseButton from "../../components/BaseButton";
import { useEffect, useRef, useState } from "react";
import Comment from "../../components/app/Comment";
import request from "../../lib/request";
import VideoInformation from "../../types/VideoInformation";
import VideoData from "../../types/VideoData";

export interface IFormattedComment {
  id: string;
  username: string;
  role: string;
  text: string;
  createdAt: Date;
  likes: number;
}

export interface IVideoComments extends IFormattedComment {
  answers: IVideoComments[];
}

export default function VideoPage() {
  const { videoID } = useParams();
  const navigate = useNavigate();
  const [showCommentButtons, setShowCommentButtons] = useState(false);
  const [showAnswersIds, setShowAnswersIds] = useState<string[]>([]);
  const [answerModal, setAnswerModal] = useState<string | null>(null);
  const [reportModal, setReportModal] = useState<string | null>(null);
  const [videoComments, setVideoComments] = useState<IVideoComments[] | []>([]);
  const [newComment, setNewComment] = useState("");
  const [videoInformation, setVideoInformation] =
    useState<VideoInformation | null>(null);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [ignoreProgressChange, setIgnoreProgressChange] = useState(false);

  const videoElement = useRef<HTMLVideoElement>(null);
  const answerTextarea = useRef<HTMLTextAreaElement>(null);
  const newCommentTextarea = useRef<HTMLTextAreaElement>(null);

  async function fetchComments() {
    const res = await request(`api/video/comments/${videoID}`);

    if (res.error) {
      console.error(res.error);
    } else {
      setVideoComments(res.comments);
    }
  }

  async function fetchVideoInformation() {
    const res = await request(`api/video/${videoID}/information`);

    if (res.error) {
      console.error(res.error);
    } else {
      setVideoInformation(res.information);

      if (videoElement.current)
        videoElement.current.currentTime = res.information.user.progress / 1000;
    }
  }

  async function fetchSaved() {
    const res = await request(`api/user/save`);

    if (res.error) {
      console.error(res.error);
    } else {
      const isSaved = res.videos.find(
        (video: VideoData) => video.video._id === videoID,
      );
      setIsVideoSaved(!!isSaved);
    }
  }

  useEffect(() => {
    fetchComments();
    fetchVideoInformation();
    fetchSaved();
  }, []);

  async function markAsRead() {
    await request(`api/user/seen`, {
      method: "POST",
      body: JSON.stringify({ videoId: videoID }),
    });
  }

  async function toggleSaved() {
    await request(`api/user/save`, {
      method: "POST",
      body: JSON.stringify({ videoId: videoID }),
    });
    setIsVideoSaved(!isVideoSaved);
  }

  function handleNewCommentFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    setShowCommentButtons(e.type === "focus");
  }

  function handleNewCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewComment(e.target.value || "");
  }

  function handleNewCommentBlur() {
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

  async function handleNewCommentSubmit() {
    if (!newComment || newComment == "") {
      return;
    }
    const res = await request(`api/video/comment`, {
      method: "POST",
      body: JSON.stringify({ videoId: videoID, text: newComment }),
    });
    if (!res.error) {
      fetchComments();
      setNewComment("");
      newCommentTextarea.current!.value = "";
      setShowCommentButtons(false);
    }
  }

  async function handleLike(id: string) {
    const res = await request(`api/video/comment/like`, {
      method: "POST",
      body: JSON.stringify({ commentId: id.toString() }),
    });
    if (!res.error) {
      fetchComments();
    }
  }

  function handleAnswerCancel() {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = "";
    }
    setAnswerModal(null);
  }

  async function handleAnswerSubmit() {
    const res = await request(`api/video/comment/answer`, {
      method: "POST",
      body: JSON.stringify({
        commentId: answerModal,
        text: answerTextarea.current?.value,
      }),
    });
    if (!res.error) {
      fetchComments();
      setAnswerModal(null);
    }
  }

  function handleReportCancel() {
    setReportModal(null);
  }

  async function handleReportSubmit() {
    const commentId = reportModal;
    if (!commentId) {
      return;
    }
    const res = await request(`api/video/comment/report`, {
      method: "POST",
      body: JSON.stringify({ commentId: commentId.toString() }),
    });
    if (!res.error) {
      console.log(res.report);
    }
    setReportModal(null);
  }

  async function handleProgress(e: any) {
    setIgnoreProgressChange(!ignoreProgressChange);
    if (!videoStarted || ignoreProgressChange) return;
    const progressPercentage = e.target.currentTime / e.target.duration;
    if (progressPercentage > 0.9) {
      await request(`api/user/seen`, {
        method: "POST",
        body: JSON.stringify({ videoId: videoID }),
      });
    }

    await request(`api/user/watch`, {
      method: "POST",
      body: JSON.stringify({
        videoId: videoID,
        progress: Math.floor(e.target.currentTime * 1000),
      }),
    });
  }

  return (
    <div className="max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="xl:flex">
        <div className="xl:basis-4/5">
          <video
            className="w-full"
            controls
            onProgress={handleProgress}
            ref={videoElement}
            onPlay={() => setVideoStarted(true)}
          >
            <source
              src={`${import.meta.env.VITE_BACKEND_URL}/api/video/stream/${videoID}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {videoInformation ? (
            <div>
              <div className="px-3 pb-4 border-b border-border-100">
                <h1 className="text-2xl font-medium mt-5">
                  {videoInformation.video.title}
                </h1>
                <span className="text-gray">
                  Hochgeladen {formatDate(videoInformation.video.creationDate)}
                </span>
              </div>
              <div className="px-3 grid grid-cols-3 gap-3 py-3 border-b border-border-100 xl:border-0">
                <VideoActionButton
                  icon={<CoursesIcon />}
                  text="Kurs ansehen"
                  onClick={() =>
                    navigate(`/app/courses/${videoInformation.course[0]._id}`)
                  }
                />
                <VideoActionButton
                  icon={<CheckMark />}
                  text="Als gesehen makieren"
                  onClick={markAsRead}
                />
                <VideoActionButton
                  icon={<SavedIcon />}
                  text={
                    isVideoSaved
                      ? "Nicht mehr speichern"
                      : "Für später speichern"
                  }
                  onClick={toggleSaved}
                />
              </div>
            </div>
          ) : (
            <div>Lädt</div>
          )}
        </div>
        {videoComments ? (
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
                onChange={handleNewCommentChange}
                ref={newCommentTextarea}
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
              {videoComments.map((comment: IVideoComments) => (
                <div key={comment.id}>
                  <Comment
                    id={comment.id}
                    author={comment.username}
                    content={comment.text}
                    createdAt={comment.createdAt.toString()}
                    likes={comment.likes}
                    onLike={handleLike}
                    onAnswer={(id) => setAnswerModal(id)}
                    onReport={(id) => setReportModal(id)}
                  />
                  {showAnswersIds.includes(comment.id) ? (
                    <div className="ml-10 mt-6 grid gap-6">
                      {comment.answers.map((answer: IFormattedComment) => (
                        <Comment
                          key={answer.id}
                          id={answer.id}
                          author={answer.username}
                          content={answer.text}
                          createdAt={answer.createdAt.toString()}
                          likes={answer.likes}
                          onLike={handleLike}
                          onAnswer={(id) => setAnswerModal(id)}
                          onReport={(id) => setReportModal(id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      {comment.answers.length > 0 && (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>Lädt</div>
        )}
      </div>
      {answerModal !== null && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 grid place-content-center px-3 z-50">
          <div className="bg-white rounded-xl border border-100 p-3">
            <textarea
              className="border border-border-100 w-full mb-3 p-3 rounded-xl outline-none resize-none focus:border-primary"
              cols={30}
              rows={5}
              placeholder="Neues Kommentar verfassen..."
              ref={answerTextarea}
            />
            <div
              id="comment-buttons"
              className="flex items-center gap-4 ml-auto w-fit"
            >
              <button onClick={handleAnswerCancel}>Abbrechen</button>
              <BaseButton onClick={handleAnswerSubmit}>Kommentieren</BaseButton>
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
  );
}
