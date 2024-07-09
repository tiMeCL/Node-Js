import { useState } from 'react';

function Post({
  post: { id, titulo, img, descripcion, likes },
  like,
  eliminarPost,
}) {
  
  const [postLikes, setPostLikes] = useState(likes);

  const toggleLike = () => {
    
    like(id);
    
    setPostLikes(postLikes => postLikes + 1);
  };

  return (
    <div className="card col-12 col-sm-4 d-inline mx-0 px-3">
      <div className="card-body  p-0">
        <img className="card-img-top" src={img} alt={titulo} />
        <div className="p-3">
          <h4 className="card-title">{titulo}</h4>
          <p className="card-text">{descripcion}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i
                onClick={toggleLike}
                className={`fa-heart fa-xl ${postLikes ? 'fa-solid text-danger' : 'fa-regular'}`}
              ></i>
              <span className="ms-1">{postLikes}</span>
            </div>
            <i
              onClick={() => eliminarPost(id)}
              className="fas fa-trash fa-xl"
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
