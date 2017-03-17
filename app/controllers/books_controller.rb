class BooksController < AuthenticatedController
  skip_before_filter :authenticate_user!, only: [:show]

  def show
    @users=User.all
    @book = Book.find(params[:id])
    if current_user
      @serialized_current_user = UserSerializer.new(current_user).as_json
    end
    if @book.present?
      @phrase_pairs = @book.phrase_pairs.order("created_at ASC")
      authorize @book
    else
      skip_authorization
      redirect_to root_path
    end
  end

  def new
    book = current_user.books.new
    authorize book
  end

  def create
    book = current_user.books.create(create_or_update_params)
    if book.present?
      authorize book
      render json: { id: book.id }, status: :ok
    else
      skip_authorization
      render json: { errors: book.errors.messages }, status: 422
    end
  end

  def destroy
    book = Book.find(params[:id])
    if book.present?
      authorize book
      book.destroy
      render json: {}, status: :ok
    else
      skip_authorization
      render json: { errors: book.errors.messages }, status: 422
    end
  end

  def update
    book = Book.find(params[:id])
    authorize book
    if book.present?
     authorize book
     book.update_attributes(create_or_update_params)
      render json: {}, status: :ok
    else
      skip_authorization
      render json: { errors: book.errors.messages }, status: 422
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
    params.require(:book).permit(
      :title,
      :description,
      :video_description,
      :source_language,
      :target_language
    )
  end
end
