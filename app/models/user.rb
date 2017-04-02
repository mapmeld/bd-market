class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates_presence_of :username
  validates_uniqueness_of :username

  has_many :posts

  has_many :favorite_posts
  has_many :favorites, through: :favorite_posts, source: :post
  belongs_to :user_user
  has_many :users, through: :user_users, source: :user

  after_create :send_admin_notification
  def send_admin_notification
    # AdminNotifications.new_user_email(self).deliver
  end

  def authored_posts
      posts.order("created_at DESC").to_a
  end

  before_destroy :clear_posts
  def clear_posts
    Post.where(user_id: self.id).delete_all
  end
end
