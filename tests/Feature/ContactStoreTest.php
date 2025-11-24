<?php
// tests/Feature/ContactStoreTest.php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class ContactStoreTest extends TestCase
{
    // Usa RefreshDatabase para resetar o banco de dados após o teste
    use RefreshDatabase;

    // O comentário com o nome do método é opcional, mas o importante é o atributo abaixo

    #[Test]
    public function deve_criar_um_contato_e_redirecionar_para_a_pagina_de_indice()
    {

        $user = User::factory(1)->create()->first();
        $this->actingAs($user); // <--- ESTA É A LINHA CHAVE

        // ARRANGE (Dados de teste válidos)
        $dadosValidos = [
            'name' => 'João da Silva',
            'email' => 'joao.silva@teste.com',
            'message' => 'Esta é uma mensagem de teste.',
        ];

        // ACT (Simula a requisição POST para a rota 'contact.store')
        $response = $this->post(route('contact.store'), $dadosValidos);

        // ASSERT (Verificações)
        $response->assertStatus(201);
        $response->assertRedirect(route('contact.index'));
        $this->assertDatabaseHas('contacts', [
            'email' => 'joao.silva@teste.com',
        ]);
        $response->assertSessionHas('success', 'Contato salvo com sucesso!');
    }
}
