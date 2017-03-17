class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :username

  has_many :favorite_posts
  has_many :posts
end
