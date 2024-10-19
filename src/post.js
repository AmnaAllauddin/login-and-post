import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, database, storage } from './configration/firebase'; 

function Post() {
  const [user, setUser] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);

  const postsCollectionRef = collection(database, "storage"); // Firestore collection name is "storage"

  // Check for authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch existing posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchPosts();
  }, []);

  // Create new post
  const createPost = async () => {
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    if (!imageUpload || !postText) {
      alert("Please provide both text and an image.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      await uploadBytes(imageRef, imageUpload);
      const imageUrl = await getDownloadURL(imageRef); // Get the image URL

      const newPost = {
        text: postText,
        imageUrl: imageUrl,
        userId: user.uid,
        createdAt: new Date(),
      };

      // Add post to Firestore and update local state
      const docRef = await addDoc(postsCollectionRef, newPost);
      setPosts((prevPosts) => [{ ...newPost, id: docRef.id }, ...prevPosts]);

      // Clear input fields after successful upload
      setPostText('');
      setImageUpload(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Delete post
  const deletePost = async (id) => {
    try {
      const postDoc = doc(database, "storage", id); // Ensure it's deleting from the correct collection
      await deleteDoc(postDoc);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Update post text
  const updatePost = async (id) => {
    try {
      const postDoc = doc(database, "storage", id); // Ensure it's updating in the correct collection
      await updateDoc(postDoc, { text: editText });
      setPosts(posts.map((post) => (post.id === id ? { ...post, text: editText } : post)));
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>

      {!user ? (
        <p>Please log in to create a post.</p>
      ) : (
        <>
          <input
            type="file"
            onChange={(event) => setImageUpload(event.target.files[0])}
            className="mb-2"
          />
          <input
            type="text"
            placeholder="Write something..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="border p-2 rounded-md w-full mb-4"
          />
          <button
            onClick={createPost}
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </>
      )}

      <h3 className="text-xl font-semibold mt-8">Posts</h3>
      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 mb-4">
            {isEditing === post.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border p-2 rounded-md w-full mb-2"
                />
                <button
                  onClick={() => updatePost(post.id)}
                  className="bg-green-500 text-white py-2 px-4 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <img src={post.imageUrl} alt="Post" className="w-full mb-2" />
                <p>{post.text}</p>
                {user && user.uid === post.userId && (
                  <>
                    <button
                      onClick={() => setIsEditing(post.id) || setEditText(post.text)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
