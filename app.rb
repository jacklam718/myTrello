require "rubygems"
require "sinatra"
require "sinatra/cross_origin"
require "dotenv"
require "trello"
require "pry"
require "sinatra/content_for"
require 'sass/plugin/rack'

use Sass::Plugin::Rack

Dotenv.load
set :sessions, true

configure do
  enable :cross_origin
end

Trello.configure do |config|
  config.developer_public_key = ENV["KEY"]
  config.member_token = ENV["TRELLO_MEMBER_TOKEN"]
end

module Sinatra::Partials
  def partial(template, *args)
    template_array = template.to_s.split('/')
    template = template_array[0..-2].join('/') + "/_#{template_array[-1]}"
    options = args.last.is_a?(Hash) ? args.pop : {}
    options.merge!(:layout => false)
    locals = options[:locals] || {}
    if collection = options.delete(:collection) then
      collection.inject([]) do |buffer, member|
        buffer << erb(:"#{template}", options.merge(:layout =>
        false, :locals => {template_array[-1].to_sym => member}.merge(locals)))
      end.join("\n")
    else
      erb(:"#{template}", options)
    end
  end
end

helpers Sinatra::Partials

helpers do
  def get_boards(username = "me")
    Trello::Member.find(username)
  end

  # extra boards names urls
  def user_boards
    boards = Trello::Board.all
  end

  def get_board_by_id(id)
    lists = Trello::Board.find(id)
  end
end

configure do
  set "layout", "views/layout"
end

get "/" do
  # erb :boards
  erb :boards
end

get "/boards/:id" do
  session[:current_board_id] = params[:id]
  erb :boards_show
end
