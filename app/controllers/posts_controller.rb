class PostsController < AuthenticatedController
  skip_before_filter :authenticate_user!, only: [:show]

  def show
    @users=User.all
    @post = Post.find(params[:id])
    if current_user
      @serialized_current_user = UserSerializer.new(current_user).as_json
    end
    if @post.present?
      @phrase_pairs = @post.phrase_pairs.order("created_at ASC")
      authorize @post
    else
      skip_authorization
      redirect_to root_path
    end
  end

  def new
    post = current_user.posts.new
    authorize post
  end

  def create
    post = current_user.posts.create(create_or_update_params)
    if post.present?
      authorize post
      render json: { id: post.id }, status: :ok
    else
      skip_authorization
      render json: { errors: post.errors.messages }, status: 422
    end
  end

  def destroy
    post = Post.find(params[:id])
    if post.present?
      authorize post
      post.destroy
      render json: {}, status: :ok
    else
      skip_authorization
      render json: { errors: post.errors.messages }, status: 422
    end
  end

  def update
    post = Post.find(params[:id])
    authorize post
    if post.present?
     authorize post
     post.update_attributes(create_or_update_params)
      render json: {}, status: :ok
    else
      skip_authorization
      render json: { errors: post.errors.messages }, status: 422
    end
  end

  def favorite
    type = params[:type]
    if type == "favorite"
      current_user.favorites << @recipe
      redirect_to :back, notice: 'You favorited #{@recipe.name}'

    elsif type == "unfavorite"
      current_user.favorites.delete(@recipe)
      redirect_to :back, notice: 'Unfavorited #{@recipe.name}'

    else
      redirect_to :back, notice: 'Nothing happened.'
    end
  end

  private

  def create_or_update_params
    params.require(:post).permit(
      :title,
      :description,
      :video_description,
      :source_language,
      :target_language
    )
  end
end
