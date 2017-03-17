class AdminNotifications < ApplicationMailer

  def new_user_email(user)
    @user = user
    mail(to: 'ndoiron@mapmeld.com', subject: 'New user: '+@user.username)
  end

  def new_post_email(post)
    @post = post
    mail(to: 'ndoiron@mapmeld.com', subject: 'New post: '+@post.title)
  end
end
