class UsersController < ApplicationController

  def show
    @user = User.find(params[:id])
    @hashedEmail = Digest::MD5.hexdigest(@user.email)
    @posts = Post.all.order("created_at DESC").map do |post|
      PostSerializer.new(post)
    end

    @authoredPosts = @user.authored_posts.map do |post|
      PostSerializer.new(post)
    end

    @favorites = @user.favorites
      .order("created_at DESC")
      .map do |post|
          PostSerializer.new(post)
    end
    # if @user.present?
    #   @phrase_pairs = @user.phrase_pairs
    #   authorize @user
    # else
    #   skip_authorization
    #   redirect_to root_path
    # end
  end
end
