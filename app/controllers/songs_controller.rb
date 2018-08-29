class SongsController < ApplicationController
  skip_before_action :authenticate_user!, only: :index
  before_action :skip_authorization
  before_action :set_song, only: [ :show ]

  def index
    if params[:query].present?
      @songs = policy_scope(Song.global_search(params[:query]))
    else
      @songs = policy_scope(Song)
    end
  end

  def show
    @minutes = @song.duration / 60000
    @seconds = @song.duration / 10000 % 60
  end

  def new
    @song = Song.new
  end

  def create
    @song = Song.new(songs_params)
    @genre = Genre.where(name: genre_params[:genre]).first
    @song.genre = @genre
    @song.user = current_user
    if @song.save
      redirect_to song_path(@song)
    else
      render :new
    end
  end

  def edit
  end

  def update
  end

  private

  def set_song
    @song = Song.find(params[:id])
  end

  def songs_params
    params.require(:song).permit(:name, :description, :bpm, :duration, :photo)
  end
  def genre_params
    params.require(:song).permit(:genre)
  end
end

