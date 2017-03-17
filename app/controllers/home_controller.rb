class HomeController < ApplicationController

  def index
    @posts = Post.all.order("created_at DESC").map do |post|
      PostSerializer.new(post)
    end
    @users = User.all

    if current_user
      redirect_to '/dashboard'
    end

  end
end