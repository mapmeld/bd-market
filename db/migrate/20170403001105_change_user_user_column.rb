class ChangeUserUserColumn < ActiveRecord::Migration
  def change
    rename_column :user_users, :user_a_id, :user_a
    rename_column :user_users, :user_b_id, :user_b    
  end
end
