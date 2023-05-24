<script lang="ts">
    export let name: string, suit: number, index: number, handCards: Array<number>;
</script>

<div
    class:red={suit == 1 || suit == 2}
    class:highlighted={handCards.includes(index)}
>
    {name}
</div>

<style>
    div {
        width: 120px;
        height: 200px;
        margin: 20px;
        padding: 10px;
        border: 1px solid grey;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .red {
        color: red;
    }

    .highlighted {
        border: 3px solid greenyellow;
    }
</style>
