class SearchesController < ApplicationController
  # Janky
  def search
    @query = params[:q]

    if params[:q].length > 0
      q = "%#{params[:q].downcase}%"
      @language = Post.where("source_language || target_language || title ilike ?", q).sort_by{|post| post.created_at}
        .reverse
        .map do |post|
          PostSerializer.new(post)
        end

      @user = User.where("username ilike ?", q).sort_by{|user| user.created_at}
        .reverse
        .map do |user|
          UserSerializer.new(user)
        end

      # @phrase = PhrasePair.where("source_phrase || target_phrase ilike ?", q).sort_by{|phrasePair| phrasePair.created_at}
      #   .reverse
      #   .map do |phrase|
      #     PhraseSerializer.new(phrase)
      #   end

      render 'search/index'

    else
      redirect_to '/'
    end

  end
end
