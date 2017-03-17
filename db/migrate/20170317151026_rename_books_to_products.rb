class RenameBooksToProducts < ActiveRecord::Migration
  def change
    rename_table :books, :posts
    rename_table :favorite_books, :favorite_posts
    rename_column :favorite_posts, :book_id, :post_id
    rename_column :phrase_pairs, :book_id, :post_id
  end
end
