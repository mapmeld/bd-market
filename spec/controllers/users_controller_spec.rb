require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  def delete
    u = FactoryGirl.create!(:user)
  end
end
