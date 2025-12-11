import Button from '../ui/Button';
import { formatTime } from '../../utils/dateUtils';

export default function RequestItem({ 
  request, 
  type = 'sent', // 'sent' or 'received'
  onCancel,
  onDelete,
  onAccept,
  onReject
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'accepted': return 'bg-green-100 border-green-300 text-green-800';
      case 'rejected': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return type === 'sent' ? '📤' : '📥';
    }
  };

  const user = type === 'sent' ? request.receiver : request.sender;

  return (
    <div className={`bg-white rounded-xl shadow-md border-2 p-4 md:p-5 transition-all hover:shadow-lg ${getStatusColor(request.status)}`}>
      <div className="flex items-start gap-3 md:gap-4">
        {/* Avatar */}
        <img
          src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=F68537&color=fff`}
          alt={user?.username}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#F68537] flex-shrink-0 object-cover"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-gray-800 font-bold text-base md:text-lg">
                {user?.username || 'Unknown User'}
              </h3>
              <p className="text-gray-600 text-xs md:text-sm truncate">
                {user?.email}
              </p>
              {user?.phone && (
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  📞 {user?.phone}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">{getStatusIcon(request.status)}</span>
                <span className="text-xs md:text-sm font-medium capitalize">
                  {request.status}
                </span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-500 text-xs md:text-sm">
                  {formatTime(request.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            {type === 'sent' && (
              <>
                {request.status === 'pending' && (
                  <Button
                    onClick={() => onCancel(request.id)}
                    variant="danger-light"
                    size="small"
                    icon="✕"
                  >
                    Cancel Request
                  </Button>
                )}
                
                {request.status === 'accepted' && (
                  <Button
                    variant="success-light"
                    size="small"
                    className="cursor-default"
                  >
                    Now Friends ✓
                  </Button>
                )}

                {request.status === 'rejected' && (
                  <Button
                    onClick={() => onDelete(request.id)}
                    variant="light"
                    size="small"
                    icon="🗑️"
                  >
                    Remove
                  </Button>
                )}
              </>
            )}

            {type === 'received' && (
              <>
                {request.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => onAccept(request.id, request.sender_id)}
                      variant="success"
                      size="small"
                      icon="✓"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => onReject(request.id)}
                      variant="danger-light"
                      size="small"
                      icon="✗"
                    >
                      Reject
                    </Button>
                  </>
                )}

                {request.status === 'accepted' && (
                  <Button
                    variant="info-light"
                    size="small"
                    className="cursor-default"
                  >
                    Now Friends ✓
                  </Button>
                )}

                {request.status === 'rejected' && (
                  <Button
                    onClick={() => onDelete(request.id)}
                    variant="light"
                    size="small"
                    icon="🗑️"
                  >
                    Remove
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}