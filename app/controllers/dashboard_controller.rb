class DashboardController < SecureController
  skip_after_action :verify_authorized, only: [:index]
  skip_after_action :verify_policy_scoped, only: [:index]

  def index
    @user = current_user
    @hashedEmail = Digest::MD5.hexdigest(@user.email)
    @friends = @user.farmers
    @posts = Post.all.order("created_at DESC").map do |post|
      PostSerializer.new(post)
    end
    @authoredPosts = Post
      .where(user_id: @user)
      .order("created_at DESC")
      .map do |post|
          PostSerializer.new(post)
    end
    @favorites = @user.favorites
      .order("created_at DESC")
      .map do |post|
          PostSerializer.new(post)
    end
  end

end
