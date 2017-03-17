class PhrasePairPolicy < ApplicationPolicy
  def destroy?
    record.post.user_id == user.id
  end

  def update?
    record.post.user_id == user.id
  end
end