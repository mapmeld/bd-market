class AddManagerIdToUsers < ActiveRecord::Migration
  def change
    drop_table :user_users
    add_column :users, :manager_id, :integer
  end
end
