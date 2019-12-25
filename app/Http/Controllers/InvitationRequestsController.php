<?php

namespace App\Http\Controllers;

use App\InvitationRequest;
use App\StatusCode;
use Illuminate\Http\Request;

class InvitationRequestsController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "App\InvitationRequest"
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            "sender_user_id" => "required",
            "receiver_user_id" => "required",
            "chat_room_id" => "required",
        ]);
        $invitationRequest = InvitationRequest::create($request->all());
        return $invitationRequest->id;
    }

    public function destory($id)
    {
        $invitationRequest = InvitationRequest::find($id);
        if (is_null($invitationRequest)) {
            return response("", StatusCode::badRequest());
        }
        $invitationRequest->delete();
    }
}
