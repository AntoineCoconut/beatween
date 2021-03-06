class Track < ApplicationRecord
  belongs_to :user
  belongs_to :instrument, optional: true
  has_many :song_tracks
  has_many :songs, through: :song_tracks
  validates :description, presence: true
  validates :uploaded_file, presence: true

  mount_uploader :uploaded_file, TrackUploader
end
