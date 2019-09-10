<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UserRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //"email" => "unique:users|max:255|required"
        ];
    }

    public function messages()
    {
        return [

            "email.unique:users" => "このメールアドレスはすでに登録されています。",
        ];
    }
}
