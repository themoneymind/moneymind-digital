import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { format, addDays, addWeeks, addMonths, addYears, isWeekday } from 'https://esm.sh/date-fns@3.3.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching transactions to process...')

    const now = new Date()
    const { data: transactions, error: fetchError } = await supabaseClient
      .from('transactions')
      .select('*')
      .neq('repeat_frequency', 'never')
      .lte('next_occurrence_date', now)

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${transactions?.length || 0} transactions to process`)

    for (const transaction of transactions || []) {
      let nextDate = new Date(transaction.next_occurrence_date)

      // Calculate next occurrence based on frequency
      switch (transaction.repeat_frequency) {
        case 'daily':
          nextDate = addDays(nextDate, 1)
          break
        case 'workdays':
          do {
            nextDate = addDays(nextDate, 1)
          } while (!isWeekday(nextDate))
          break
        case 'weekly':
          nextDate = addWeeks(nextDate, 1)
          break
        case 'biweekly':
          nextDate = addWeeks(nextDate, 2)
          break
        case 'triweekly':
          nextDate = addWeeks(nextDate, 3)
          break
        case 'monthly':
          nextDate = addMonths(nextDate, 1)
          break
        case 'bimonthly':
          nextDate = addMonths(nextDate, 2)
          break
        case 'quarterly':
          nextDate = addMonths(nextDate, 3)
          break
        case 'semiannually':
          nextDate = addMonths(nextDate, 6)
          break
        case 'annually':
          nextDate = addYears(nextDate, 1)
          break
      }

      // Skip if we've passed the repeat_until date
      if (transaction.repeat_until && new Date(transaction.repeat_until) < nextDate) {
        console.log(`Skipping transaction ${transaction.id} as it's past the repeat_until date`)
        continue
      }

      // Create new transaction
      const { error: insertError } = await supabaseClient
        .from('transactions')
        .insert({
          user_id: transaction.user_id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          source: transaction.source,
          description: transaction.description,
          date: new Date().toISOString(),
          reference_type: transaction.reference_type,
          status: 'pending',
          base_source_id: transaction.base_source_id,
          display_source: transaction.display_source,
          repeat_frequency: transaction.repeat_frequency,
          repeat_until: transaction.repeat_until,
          original_transaction_id: transaction.original_transaction_id || transaction.id,
          next_occurrence_date: nextDate.toISOString(),
        })

      if (insertError) {
        console.error(`Error creating recurring transaction: ${insertError.message}`)
        continue
      }

      // Update original transaction's next occurrence date
      const { error: updateError } = await supabaseClient
        .from('transactions')
        .update({ next_occurrence_date: nextDate.toISOString() })
        .eq('id', transaction.id)

      if (updateError) {
        console.error(`Error updating next occurrence date: ${updateError.message}`)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Recurring transactions processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing recurring transactions:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})