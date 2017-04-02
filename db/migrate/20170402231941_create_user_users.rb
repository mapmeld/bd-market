class CreateUserUsers < ActiveRecord::Migration
  def change
    create_table :user_users do |t|
      t.integer :user_a_id
      t.integer :user_b_id
    end
  end
end
