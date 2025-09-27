<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',     // O campo é obrigatório
                'string',       // Deve ser uma string (texto)
                'min:3',        // Deve ter no mínimo 3 caracteres
                'max:100',      // Deve ter no máximo 100 caracteres
            ],

            'phone_number' => [
                'nullable',     // O campo é opcional (pode ser vazio). Se fosse obrigatório, use 'required'.
                'string',       // Deve ser uma string
                'max:20',       // Limite o tamanho para 20 (suficiente para a maioria dos formatos internacionais)
            ],
        ];
    }
}
