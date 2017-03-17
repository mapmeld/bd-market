class FavoritesController < SecureController

  def create
    post = Post.find(params[:post_id])
    #TODO: get this working correctly
    skip_policy_scope
    skip_authorization

    if post
      current_user.favorites << post
      render json: {}, status: :ok
    else
      render json: {}, status: 404
    end
  end

  def destroy
    favorite_post = Post.find(params[:id])

    #TODO: get this working correctly
    skip_policy_scope
    skip_authorization

    if favorite_post
      current_user.favorites.delete(favorite_post)
      render json: {}, status: :ok
    else
      render json: {}, status: 404
    end
  end
end
