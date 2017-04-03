class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :username, :role

  has_many :favorite_posts
  has_many :posts
  has_many :farmers
end
