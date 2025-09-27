<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::all();
        return Inertia::render('contact/index', compact('contacts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('contact/create-contact');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        $user = Auth::user();

        $data = $request->validated();

        $user->contacts()->create($data);

        return redirect()->route('contact.index')->with(['status' => 'ok', 'message' => 'Contact created successfully!'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        $contact = Contact::findOrFail($contact);
        return Inertia::render('contact/show', compact('contact'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        return Inertia::render('contact/edit', compact('contact'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact) {
        //Quero fazer agora não :'C
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        return Contact::destroy($contact);
    }
}
