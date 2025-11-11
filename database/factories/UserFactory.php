<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function joao(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'João Víctor Miranda Carvalho',
            'email' => 'joao002miranda@gmail.com',
            'email_verified_at' => now(),
            'phone_number' => '74999476204',
            'password' => Hash::make('Victor_@!@6411'),
            'remember_token' => Str::random(10),
        ]);
    }
    public function michael(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Michael Shumaker Queiroz Loula de Carvalho',
            'email' => 'michaelloula02@gmail.com',
            'email_verified_at' => now(),
            'phone_number' => '74999668780',
            'password' => Hash::make('minerios!234'),
            'remember_token' => Str::random(10),
        ]);
    }
}
