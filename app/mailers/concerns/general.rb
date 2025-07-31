module General
  extend ActiveSupport::Concern
  
  def mail_message(user, subject, channel_type=nil)
    channel_type ||= caller_locations(1,1)[0].label
    return nil unless user && user.settings && !user.settings['email'].blank? && user.settings['email'].match(/\@/)
    from = JsonApi::Json.current_domain['settings']['admin_email']
    user.channels_for(channel_type).each do |path|
      opts = {to: path, subject: "#{app_name} - #{subject}"}
      opts[:from] = from if !from.blank?
      mail(opts)
    end
  end
  
  def full_domain_enabled
    !!JsonApi::Json.current_domain['settings']['full_domain']
  end

  def app_name
    JsonApi::Json.current_domain['settings']['app_name'] || "LingoLinq AAC"
  end

  module ClassMethods
    def schedule_delivery(delivery_type, *args)
      Worker.schedule_for(:priority, self, :deliver_message, delivery_type, *args)
    end
  
    def deliver_message(method_name, *args)
      begin
        method = self.send(method_name, *args)
        method.respond_to?(:deliver_now) ? method.deliver_now : method.deliver
      rescue Aws::SES::Errors::InvalidParameterValue => e
        # TODO: ...
      end
    end
  end
end