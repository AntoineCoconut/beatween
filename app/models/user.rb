class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :songs
  has_many :tracks
  validates :username, presence: true
  validates :first_name, presence: true
  validates :last_name, presence: true

  mount_uploader :photo, PhotoUploader
end
