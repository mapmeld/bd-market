class UserUser < ActiveRecord::Base
  belongs_to :user_a, class_name: "User", foreign_key: "user_a"
  belongs_to :user_b, class_name: "User", foreign_key: "user_b"
end
